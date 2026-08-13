"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import { CalendarIcon, Clock, MapPin, Sparkles, ArrowRight, Check, Loader2, User, Heart } from "lucide-react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user/user.actions";

// 🛡️ ZOD SCHEMA
const formSchema = z.object({
  dob: z.date({ required_error: "Date of Birth is required." }),
  tob: z.string().min(1, { message: "Time of birth is required." }),
  pob: z.string().min(2, { message: "Please select a valid city." }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  gender: z.enum(["male", "female", "non-binary", "other"], {
    required_error: "Please select identity.",
  }),
  relationshipStatus: z.enum(["single", "taken", "complicated", "healing"], {
    required_error: "Please select relationship status.",
  }),
});

export default function OnboardingForm({ dbUser }: { dbUser: any }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // City Search States
  const [openCityBox, setOpenCityBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [cities, setCities] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Time States
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [ampm, setAmpm] = useState<string>("AM");
  const [isDobOpen, setIsDobOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tob: "",
      pob: "",
    },
  });

  const handleTimeChange = (type: "h" | "m" | "p", val: string) => {
    let newH = hour;
    let newM = minute;
    let newP = ampm;

    if (type === "h") { newH = val; setHour(val); }
    if (type === "m") { newM = val; setMinute(val); }
    if (type === "p") { newP = val; setAmpm(val); }

    const finalH = newH || "12";
    const finalM = newM || "00";

    let hh = parseInt(finalH);
    if (newP === "PM" && hh !== 12) hh += 12;
    if (newP === "AM" && hh === 12) hh = 0;

    form.setValue("tob", `${hh.toString().padStart(2, "0")}:${finalM}`, { shouldValidate: true });

    if (!newH) setHour("12");
    if (!newM) setMinute("00");
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!dbUser?.clerkId) return;
    setLoading(true);

    const result = await updateUser(dbUser?.clerkId, {
      birthDetails: {
        dob: values.dob,
        tob: values.tob,
        pob: values.pob,
        latitude: values.latitude,
        longitude: values.longitude,
      },
      gender: values.gender,
      relationshipStatus: values.relationshipStatus,
      languagePref: "hinglish",
      isProfileComplete: true,
    });

    setLoading(false);

    if (result.success) {
      // router.push("/chat");
      // inngest
    } else {
      console.error("Failed to update profile", result.error);
    }
  };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setOpenCityBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery === form.getValues("pob")) {
      setCities([]);
      setIsSearching(false);
      return;
    }

    const fetchCities = async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=5&language=en&format=json`
        );
        if (res.data.results) {
          setCities(res.data.results);
          setOpenCityBox(true);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchCities();
  }, [debouncedQuery]);



  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {dbUser?.clerkId}

      {/* 🚀 ROW 1: DOB & TOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* DATE OF BIRTH */}
        <Controller
          name="dob"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-1.5 w-full">
              <FieldLabel htmlFor="dob" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Date of Birth
              </FieldLabel>

              <Popover open={isDobOpen} onOpenChange={setIsDobOpen}>
                <PopoverTrigger
                  id="dob"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full h-11 pl-3 text-left text-xs font-normal rounded-xl border-border/50 bg-background/50 hover:bg-background hover:text-primary transition-all",
                    !field.value && "text-muted-foreground",
                    fieldState.invalid && "border-destructive text-destructive"
                  )}
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick birth date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl border-border/50 shadow-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      if (date) setIsDobOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* TIME OF BIRTH */}
        <Controller
          name="tob"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-1.5 w-full">
              <FieldLabel htmlFor="tob" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> Time of Birth
              </FieldLabel>

              <div className="flex items-center gap-1.5 w-full">
                <Select value={hour} onValueChange={(v) => handleTimeChange("h", v)}>
                  <SelectTrigger className={cn("min-h-11 w-full rounded-xl border-border/50 bg-background/50 text-xs", fieldState.invalid && "border-destructive")}>
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-xl max-h-[180px]">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const val = (i + 1).toString().padStart(2, "0");
                      return <SelectItem key={`h-${val}`} value={val} className="text-xs">{val}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>

                <span className="text-sm font-bold text-muted-foreground">:</span>

                <Select value={minute} onValueChange={(v) => handleTimeChange("m", v)}>
                  <SelectTrigger className={cn("min-h-11 w-full rounded-xl border-border/50 bg-background/50 text-xs", fieldState.invalid && "border-destructive")}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-xl max-h-[180px]">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const val = i.toString().padStart(2, "0");
                      return <SelectItem key={`m-${val}`} value={val} className="text-xs">{val}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>

                <Select value={ampm} onValueChange={(v) => handleTimeChange("p", v)}>
                  <SelectTrigger className={cn("min-h-11 w-[85px] rounded-xl border-border/50 bg-background/50 text-xs", fieldState.invalid && "border-destructive")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-xl">
                    <SelectItem value="AM" className="text-xs">AM</SelectItem>
                    <SelectItem value="PM" className="text-xs">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* 🚀 ROW 2: CITY OF BIRTH */}
      <Controller
        name="pob"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-1.5 w-full">
            <FieldLabel htmlFor="pob" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> City of Birth
            </FieldLabel>

            <div className="relative w-full" ref={cityDropdownRef}>
              <Input
                id="pob"
                autoComplete="off"
                placeholder="Search city (e.g. Mumbai)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (field.value) {
                    form.setValue("pob", "");
                    form.setValue("latitude", undefined);
                    form.setValue("longitude", undefined);
                  }
                  if (e.target.value.length > 2) {
                    setOpenCityBox(true);
                  } else {
                    setOpenCityBox(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 2 && cities.length > 0) setOpenCityBox(true);
                }}
                className={cn(
                  "w-full h-11 rounded-xl border-border/50 bg-background/50 text-xs focus-visible:ring-primary/50 transition-all pr-10",
                  fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={fieldState.invalid}
              />

              {isSearching && (
                <div className="absolute right-3 top-3 pointer-events-none">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {openCityBox && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full rounded-xl border border-border/50 bg-popover shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95">
                  <Command shouldFilter={false}>
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                        {isSearching ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Searching cosmos...
                          </span>
                        ) : (
                          "No cosmic city found."
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => {
                          const locationString = `${city.name}, ${city.admin1 || ""}, ${city.country}`.replace(/, ,/g, ",");
                          return (
                            <CommandItem
                              key={city.id}
                              value={city.name}
                              onSelect={() => {
                                form.setValue("pob", locationString);
                                form.setValue("latitude", city.latitude);
                                form.setValue("longitude", city.longitude);
                                setSearchQuery(locationString);
                                setOpenCityBox(false);
                              }}
                              className="cursor-pointer py-2 text-xs transition-colors hover:bg-primary/10"
                            >
                              <MapPin className="mr-2 h-3.5 w-3.5 text-primary/50" />
                              <span className="font-medium text-foreground">{city.name}</span>
                              {city.admin1 && <span className="text-muted-foreground mx-1">, {city.admin1}</span>}
                              <span className="text-muted-foreground ml-auto text-[10px]">{city.country}</span>
                              <Check className={cn("ml-2 h-3.5 w-3.5", field.value === locationString ? "opacity-100 text-primary" : "opacity-0")} />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* 🚀 ROW 3: IDENTITY & RELATIONSHIP VIBE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* GENDER */}
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-1.5 w-full">
              <FieldLabel htmlFor="gender" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Identity
              </FieldLabel>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger id="gender" className={cn("h-11 w-full rounded-xl border-border/50 bg-background/50 text-xs", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  <SelectItem value="male" className="text-xs">👨 Male</SelectItem>
                  <SelectItem value="female" className="text-xs">👩 Female</SelectItem>
                  <SelectItem value="non-binary" className="text-xs">🧑‍🎤 Non-Binary</SelectItem>
                  <SelectItem value="other" className="text-xs">🌌 Other</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* RELATIONSHIP STATUS */}
        <Controller
          name="relationshipStatus"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-1.5 w-full">
              <FieldLabel htmlFor="relationshipStatus" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary" /> Current Vibe
              </FieldLabel>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger id="relationshipStatus" className={cn("h-11 w-full rounded-xl border-border/50 bg-background/50 text-xs", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="Relationship Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  <SelectItem value="single" className="text-xs">🕺 Single</SelectItem>
                  <SelectItem value="taken" className="text-xs">💑 Taken</SelectItem>
                  <SelectItem value="complicated" className="text-xs">🌪️ Complicated</SelectItem>
                  <SelectItem value="healing" className="text-xs">❤️‍🩹 Healing</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* 🚀 SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={loading}
        className="group relative flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[0_0_25px_-5px_rgba(var(--primary),0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 mt-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-spin" /> Aligning Stars...
          </span>
        ) : (
          <>
            Continue to Cosmos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
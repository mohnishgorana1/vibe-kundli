"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import { CalendarIcon, Clock, MapPin, Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button"; 
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user/user.actions"; 

// 🛡️ ZOD SCHEMA
const formSchema = z.object({
  dob: z.date({ required_error: "Cosmic logic needs your Date of Birth." }),
  tob: z.string().min(1, { message: "Exact time helps in accurate reading." }),
  pob: z.string().min(2, { message: "Please select a valid city from the dropdown." }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export default function OnboardingForm() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🌍 City Search States
  const [openCityBox, setOpenCityBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400); 
  const [cities, setCities] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // 🕒 Custom Time States
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [ampm, setAmpm] = useState<string>("AM");

  // 📅 DOB Calendar State (For auto-close)
  const [isDobOpen, setIsDobOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tob: "",
      pob: "",
    },
  });

  // 🕒 Handle Time Selection Logic
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
    
    form.setValue("tob", `${hh.toString().padStart(2, '0')}:${finalM}`, { shouldValidate: true });
    
    if (!newH) setHour("12");
    if (!newM) setMinute("00");
  };

  // 🖱️ Click outside to close city dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setOpenCityBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚀 FETCH CITIES
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery === form.getValues("pob")) {
      setCities([]);
      setIsSearching(false);
      return;
    }

    const fetchCities = async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=5&language=en&format=json`);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    setLoading(true);

    const result = await updateUser(user.id, {
      birthDetails: {
        dob: values.dob,
        tob: values.tob,
        pob: values.pob,
        latitude: values.latitude,
        longitude: values.longitude,
      },
      isProfileComplete: true, 
    });

    setLoading(false);

    if (result.success) {
      router.push("/chat");
    } else {
      console.error("Failed to update profile", result.error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
      
      {/* 📅 DATE OF BIRTH (Shadcn Native Dropdown Style) */}
      <Controller
        name="dob"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-2 w-full">
            <FieldLabel htmlFor="dob" className="text-sm font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" /> Date of Birth
            </FieldLabel>
            
            <Popover open={isDobOpen} onOpenChange={setIsDobOpen}>
              <PopoverTrigger
                id="dob"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-12 pl-3 text-left font-normal rounded-xl border-border/50 bg-background/50 hover:bg-background hover:text-primary transition-all",
                  !field.value && "text-muted-foreground",
                  fieldState.invalid && "border-destructive text-destructive"
                )}
              >
                {field.value ? format(field.value, "PPP") : <span>Pick your birth date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl border-border/50 shadow-xl" align="start">
                <Calendar 
                  mode="single" 
                  selected={field.value} 
                  onSelect={(date) => {
                    field.onChange(date);
                    if (date) setIsDobOpen(false); // Auto close on select
                  }} 
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")} 
                  initialFocus 
                  
                  // 🔥 MAGIC: Shadcn Native Dropdowns for Month & Year
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

      {/* 🕒 TIME OF BIRTH */}
      <Controller
        name="tob"
        control={form.control}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-2 w-full">
            <FieldLabel htmlFor="tob" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Time of Birth
            </FieldLabel>
            
            <div className="flex items-center gap-2 w-full">
              {/* HOURS */}
              <Select value={hour} onValueChange={(v) => handleTimeChange("h", v)}>
                <SelectTrigger className={cn("h-12 w-full rounded-xl border-border/50 bg-background/50", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl max-h-[200px]">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return <SelectItem key={`h-${val}`} value={val}>{val}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              
              <span className="text-lg font-bold text-muted-foreground">:</span>
              
              {/* MINUTES */}
              <Select value={minute} onValueChange={(v) => handleTimeChange("m", v)}>
                <SelectTrigger className={cn("h-12 w-full rounded-xl border-border/50 bg-background/50", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl max-h-[200px]">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const val = i.toString().padStart(2, '0');
                    return <SelectItem key={`m-${val}`} value={val}>{val}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              
              {/* AM/PM */}
              <Select value={ampm} onValueChange={(v) => handleTimeChange("p", v)}>
                <SelectTrigger className={cn("h-12 w-[110px] rounded-xl border-border/50 bg-background/50", fieldState.invalid && "border-destructive")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* 📍 PLACE OF BIRTH */}
      <Controller
        name="pob"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col space-y-2 w-full">
            <FieldLabel htmlFor="pob" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> City of Birth
            </FieldLabel>

            <div className="relative w-full" ref={cityDropdownRef}>
              <Input
                id="pob"
                autoComplete="off"
                placeholder="Search your city (e.g. Mumbai)..."
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
                  "w-full h-12 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/50 transition-all text-base pr-10",
                  fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={fieldState.invalid}
              />
              
              {isSearching && (
                <div className="absolute right-3 top-3.5 pointer-events-none">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {openCityBox && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-xl border border-border/50 bg-popover shadow-xl outline-hidden overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <Command shouldFilter={false}>
                    <CommandList>
                      <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                        {isSearching ? (
                           <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary"/> Searching cosmos...</span>
                        ) : (
                           "No cosmic city found."
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => {
                          const locationString = `${city.name}, ${city.admin1 || ""}, ${city.country}`.replace(/, ,/g, ',');
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
                              className="cursor-pointer py-2.5 transition-colors hover:bg-primary/10"
                            >
                              <MapPin className="mr-2 h-4 w-4 text-primary/50" />
                              <span className="font-medium text-foreground">{city.name}</span>
                              {city.admin1 && <span className="text-muted-foreground mx-1">, {city.admin1}</span>} 
                              <span className="text-muted-foreground ml-auto text-xs">{city.country}</span>
                              
                              <Check className={cn("ml-2 h-4 w-4", field.value === locationString ? "opacity-100 text-primary" : "opacity-0")} />
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

      {/* 🚀 SUBMIT BUTTON */}
      <Button 
        type="submit" 
        disabled={loading} 
        className="group relative flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all disabled:opacity-70 mt-4" 
      >
        {loading ? (
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-spin" /> Aligning Stars...</span>
        ) : (
          <>Continue to Chat <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
        )}
      </Button>
    </form>
  );
}
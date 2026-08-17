import { NextResponse } from 'next/server';
import { getMongoUserId } from '@/lib/helpers/auth';
import Message from '@/models/message.model';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    const userId = await getMongoUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await dbConnect();
    
    // Purani messages fetch karo (purani sabse pehle aayegi isliye sort: 1)
    const messages = await Message.find({ userId }).sort({ createdAt: 1 });
    
    // Frontend ke format mein map kar do
    const formattedMessages = messages.map(m => ({
      id: m._id.toString(),
      role: m.role,
      content: m.content
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("[CHAT_HISTORY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE() {
  try {
    const userId = await getMongoUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    await dbConnect();
    await Message.deleteMany({ userId }); // Delete all messages for this user
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
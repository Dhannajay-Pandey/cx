import { connectDB } from "../../../lib/databaseConnection";
import { NextResponse } from 'next/server';

function getErrorMessage(err) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
    });
  } catch (err) {
    const message = getErrorMessage(err);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: message,
    }, { status: 500 });
  }
}
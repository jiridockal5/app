import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/scenarios - List all scenarios for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const scenarios = await prisma.scenario.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenarios' },
      { status: 500 }
    );
  }
}

// POST /api/scenarios - Create a new scenario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, dialValues } = body;

    if (!userId || !name || !dialValues) {
      return NextResponse.json(
        { error: 'userId, name, and dialValues are required' },
        { status: 400 }
      );
    }

    const scenario = await prisma.scenario.create({
      data: {
        userId,
        name,
        dialValues,
      },
    });

    return NextResponse.json({ scenario }, { status: 201 });
  } catch (error) {
    console.error('Error creating scenario:', error);
    return NextResponse.json(
      { error: 'Failed to create scenario' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'No file provided' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64String,
                {
                    folder: 'user_avatars',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        return NextResponse.json({
            url: (result as any).secure_url,
            public_id: (result as any).public_id,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { message: `Upload failed: ${error.message}` },
            { status: 500 }
        );
    }
}

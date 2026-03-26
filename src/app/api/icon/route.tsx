import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get('size') || '192');
  const maskable = searchParams.get('maskable') === '1';

  // Padding extra para ícone maskable (zona segura)
  const padding = maskable ? Math.round(size * 0.15) : Math.round(size * 0.08);
  const iconSize = size - padding * 2;
  const radius = maskable ? 0 : Math.round(size * 0.22);
  const scissorSize = Math.round(iconSize * 0.55);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: maskable
            ? 'linear-gradient(145deg, #ea6a1a 0%, #f97316 50%, #c2410c 100%)'
            : 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius,
          position: 'relative',
        }}
      >
        {/* Glow de fundo */}
        <div
          style={{
            position: 'absolute',
            width: iconSize * 0.8,
            height: iconSize * 0.8,
            background: 'rgba(249,115,22,0.25)',
            borderRadius: '50%',
            filter: 'blur(20px)',
          }}
        />
        {/* Ícone central */}
        <div
          style={{
            width: iconSize,
            height: iconSize,
            background: maskable
              ? 'rgba(255,255,255,0.15)'
              : 'linear-gradient(135deg, #f97316, #c2410c)',
            borderRadius: Math.round(iconSize * 0.25),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: maskable ? 'none' : '0 0 40px rgba(249,115,22,0.5)',
          }}
        >
          <span
            style={{
              fontSize: scissorSize,
              lineHeight: 1,
              color: '#ffffff',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            }}
          >
            ✂
          </span>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}

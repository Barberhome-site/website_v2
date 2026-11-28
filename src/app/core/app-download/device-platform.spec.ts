import { detectPlatform } from './device-platform';

function fakeWindow(userAgent: string, maxTouchPoints = 0): Window {
  return { navigator: { userAgent, maxTouchPoints } } as unknown as Window;
}

describe('detectPlatform', () => {
  it('reconnaît iPhone et iPad', () => {
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'))).toBe('ios');
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'))).toBe('ios');
  });

  it('reconnaît iPadOS, qui se présente comme un Mac avec écran tactile', () => {
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5))).toBe('ios');
  });

  it('reconnaît Android', () => {
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (Linux; Android 15; Pixel 9)'))).toBe('android');
  });

  it('considère ordinateur, Mac sans écran tactile et rendu serveur comme « desktop »', () => {
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'))).toBe('desktop');
    expect(detectPlatform(fakeWindow('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0))).toBe('desktop');
    expect(detectPlatform(null)).toBe('desktop');
  });
});

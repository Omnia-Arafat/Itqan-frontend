"use client"

import { JitsiMeeting } from '@jitsi/react-sdk';

interface LiveHalaqaProps {
    roomName: string;
    displayName: string;
}

export default function LiveHalaqa({ roomName, displayName }: LiveHalaqaProps) {
    return (
        <div className="h-full w-full rounded-lg overflow-hidden border">
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableDeepLinking: true,
                    prejoinPageEnabled: false,
                }}
                userInfo={{
                    displayName: displayName,
                    email: "user@example.com" // Placeholder
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
            />
        </div>
    );
}

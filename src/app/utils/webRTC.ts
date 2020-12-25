// interface CallUserProps {
  
// }

// const callUser = (
//   userID: string,
//   peerRef: React.MutableRefObject<RTCPeerConnection>,
//   userStream: React.MutableRefObject<MediaStream>
//   ) => {
//     peerRef.current = createPeer(userID, peerRef)
//     userStream.current
//       .getTracks()
//       .forEach((track: MediaStreamTrack) => peerRef.current.addTrack(track, userStream.current))
    
//     return peerRef
// }

// const createPeer = (userID: string, peerRef: ) => {
//   const peer = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:stun.l.google.com:19302"
//       }
//     ]
//   })
//   peer.onicecandidate = hanldeICECandidateEvent
//   peer.ontrack = handleTrackEvent
//   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)

//   return peer
// }

// const handleNegotiationNeededEvent = (userID: string) => {
//   peerRef
// }

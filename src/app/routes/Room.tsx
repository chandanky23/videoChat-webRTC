import React, { useRef, useEffect, VideoHTMLAttributes } from 'react'
import io, { Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { IceCandidateTypes } from 'server/websockets'

type VideoPropTypes = HTMLVideoElement & {
  srcObject: MediaStream
}

interface RouterParamTypes {
  roomId: string
}

const Room: React.FC = () => {

  const userVideo = useRef<VideoPropTypes>(null)
  const partnerVideo = useRef<VideoPropTypes>(null)
  const peerRef = useRef<RTCPeerConnection>()
  const socketRef = useRef<typeof Socket>()
  const otherUser = useRef<string>(null)
  const userStream = useRef<MediaStream>(null)
  const { roomId } = useParams<RouterParamTypes>()

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })

    userVideo.current.srcObject = stream
    userStream.current = stream

    socketRef.current = io.connect('/')
    socketRef.current.emit('join-room', roomId)

    socketRef.current.on('other-user', (userID: string) => {
      callUser(userID)
      otherUser.current = userID
    })

    socketRef.current.on("new-user", (userID: string) => {
      otherUser.current = userID
    })

    socketRef.current.on('offer', handleReceiveCall)

    socketRef.current.on('answer', handleAnswer)

    socketRef.current.on('ic-candidate', handleNewICECandidateMSG)
  
  }

  useEffect(() => {
    init()
  }, [])

  const callUser = (userID: string) => {
    peerRef.current = createPeer(userID)
    userStream.current
      .getTracks()
      .forEach((track: MediaStreamTrack) => peerRef.current.addTrack(track, userStream.current))
  }

  const createPeer = (userID?: string) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })
    peer.onicecandidate = hanldeICECandidateEvent
    peer.ontrack = handleTrackEvent
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)

    return peer
  }

  const handleNegotiationNeededEvent = async (userID: string) => {
    const offer = await peerRef.current.createOffer()
    await peerRef.current.setLocalDescription(offer)
    const payload = {
      target: userID,
      caller: socketRef.current.id,
      sdp: peerRef.current.localDescription
    }
    await socketRef.current.emit('offer', payload)
  }

  const handleReceiveCall = async (incoming: any) => {
    peerRef.current = createPeer()
    const desc = new RTCSessionDescription(incoming.sdp)
    await peerRef.current.setRemoteDescription(desc)
    await userStream.current.getTracks().forEach((track: MediaStreamTrack) => peerRef.current.addTrack(track, userStream.current))
    const answer = await peerRef.current.createAnswer()
    await peerRef.current.setLocalDescription(answer)
    const payload = {
      target: incoming.caller,
      caller: socketRef.current.id,
      sdp: peerRef.current.localDescription
    }
    await socketRef.current.emit('answer', payload)
  }

  const handleAnswer = (message: any) => {
    const desc = new RTCSessionDescription(message.sdp)
    peerRef.current.setRemoteDescription(desc)
  }

  const hanldeICECandidateEvent = (e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate
      }
      socketRef.current.emit('ice-candidate', payload)
    }
  }

  const handleNewICECandidateMSG = (incoming: any) => {
    const candidate = new RTCIceCandidate(incoming)
    peerRef.current.addIceCandidate(candidate)
  }

  const handleTrackEvent = (e: any) => {
    partnerVideo.current.srcObject = e.streams[0]
  }

  return (
    <div>
      <video autoPlay ref={userVideo} />
      <video autoPlay ref={partnerVideo} />
    </div>
  )
}

export default Room
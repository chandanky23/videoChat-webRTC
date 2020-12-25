import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { CreateRoomContainer, CreateRoomButton } from './styles'

const CreateRoom: React.FC = () => {
  const history = useHistory()
  
  const create = () => {
    const id = uuid()
    history.push(`/room/${id}`)
  }

  return (
    <CreateRoomContainer>
      <CreateRoomButton onClick={create}>Create Room</CreateRoomButton>
    </CreateRoomContainer>
  )
}

export default CreateRoom
"use client"
import React, { memo } from 'react'
import { ChatMessage } from '@/types'
import { MessageItem } from './MessageItem'

export const MessageList = memo(function MessageList({ messages, isLoading }: { messages: ChatMessage[], isLoading: boolean }) {
  return (
    <div className="flex flex-col w-full pb-20">
      {messages.map((message, index) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          isLoading={isLoading && index === messages.length - 1} 
        />
      ))}
    </div>
  )
})


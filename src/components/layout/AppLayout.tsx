"use client"
import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ChatInterface } from '../chat/ChatInterface'
import { ImageGenerationInterface } from '../image/ImageGenerationInterface'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<'chat' | 'image'>('chat')
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden relative bg-background flex flex-col">
          {activeView === 'chat' ? <ChatInterface /> : <ImageGenerationInterface />}
        </main>
      </div>
    </div>
  )
}

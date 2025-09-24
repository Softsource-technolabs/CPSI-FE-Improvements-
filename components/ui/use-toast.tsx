"use client"

interface ToastProps {
  title: string
  description?: string
  duration?: number
}

export function toast({ title, description, duration = 3000 }: ToastProps) {
  const toastContainer = document.getElementById("toast-container")

  if (!toastContainer) {
    const container = document.createElement("div")
    container.id = "toast-container"
    container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(container)
  }

  const toast = document.createElement("div")
  toast.className = "bg-background border rounded-md shadow-lg p-4 w-80 animate-in slide-in-from-right-5 duration-300"

  const header = document.createElement("div")
  header.className = "flex justify-between items-center"

  const titleElement = document.createElement("h5")
  titleElement.className = "font-medium"
  titleElement.textContent = title

  const closeButton = document.createElement("button")
  closeButton.className = "text-muted-foreground hover:text-foreground"
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`

  closeButton.onclick = () => {
    toast.classList.replace("slide-in-from-right-5", "slide-out-to-right-5")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }

  header.appendChild(titleElement)
  header.appendChild(closeButton)
  toast.appendChild(header)

  if (description) {
    const descriptionElement = document.createElement("p")
    descriptionElement.className = "text-sm text-muted-foreground mt-1"
    descriptionElement.textContent = description
    toast.appendChild(descriptionElement)
  }

  document.getElementById("toast-container")?.appendChild(toast)

  setTimeout(() => {
    toast.classList.replace("slide-in-from-right-5", "slide-out-to-right-5")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, duration)
}


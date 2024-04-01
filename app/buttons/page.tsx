import { Button } from "@/components/ui/button"

const ButtonsPage = () => {
  return (
    <div className="flex flex-col max-w-[200px] p-4 space-y-4">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="primaryOutline">Primary Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondaryOutline">Secondary Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="dangerOutline">Danger Outline</Button>
        <Button variant="super">Super</Button>
        <Button variant="superOutline">Super Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="sidebar">sidebar</Button>
        <Button variant="sidebarOutline">sidebar Outline</Button>
    </div>
  )
}

export default ButtonsPage
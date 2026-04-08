import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CrossIcon } from "lucide-react";
import { Crosshair } from "lucide-react";
import { Cross } from "lucide-react";

export default function Tags({ name }) {
  return (
    <div>
      <Button variant='outline' className='text-green-600 flex justify-around'><X /> <span>{name}</span></Button>
    </div>
  )
}


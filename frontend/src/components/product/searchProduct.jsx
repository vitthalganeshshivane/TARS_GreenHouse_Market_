import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const SearchProduct = ({ className }) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [search, setSearch] = useState('');

  async function handleSubmit() {
    console.log(search)
    //
    //submit
  }

  return (



    <div className={cn(className)}>
      <form onSubmit={handleSubmit} className={cn("rounded-sm flex p-1 justify-between items-center w-full border", inputFocus ? 'border-green-400' : '')} >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-[90%]"
          type="text"
          placeholder="Search for products..."
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
        <Button className='bg-green-500' >Search</Button>
      </form>
    </div >
  )
}

export default SearchProduct




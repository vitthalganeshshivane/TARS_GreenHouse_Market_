import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

const SearchProduct = () => {
  const [inputFocus, setInputFocus] = useState(false);
  const [search, setSearch] = useState('');

  async function handleSubmit() {
    console.log(search)
    //
    //submit
  }

  return (



    <div>
      <form onSubmit={handleSubmit} className={cn("rounded-sm flex p-1 justify-between items-center md:w-150 w-[95%] border", inputFocus ? 'border-green-400' : '')} >
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




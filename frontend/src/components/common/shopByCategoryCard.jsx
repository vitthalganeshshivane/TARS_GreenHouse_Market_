import { Link } from "react-router";

export default function ShopByCategoryCard({ link, image, itemCount, title }) {
  return (
    <Link href={link} className="bg-primary-foreground w-42 md:w-50 p-4 rounded-md flex flex-col items-center gap-5">
      <img src={image} alt={image} />
      <span className="text-bold text-xl">{title}</span>
      <span className="text-gray-500"><span>{itemCount}</span> <span>items</span></span>
    </Link>
  )
}


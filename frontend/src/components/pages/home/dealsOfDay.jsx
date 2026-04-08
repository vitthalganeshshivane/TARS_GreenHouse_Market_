import { MoveRight } from "lucide-react";
import { useDeviceType } from "../../../lib/device";
import DealsOfDayComponent from "../../dealsOfDayComponent";
import { Button } from "../../ui/button";

export default function DealsOfDay() {

  const { isMobile } = useDeviceType();


  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-6">
      <div className="flex justify-between">
        <h2 className="text-xl md:text-3xl font-semibold mb-5">Deals Of The Day</h2>
        <Button variant="ghost" className='text-primary'>All Details <MoveRight /></Button>
      </div>

      <div className="flex justify-around flex-wrap space-y-5 ">
        <DealsOfDayComponent
          image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
          name='Organic Red Rice'
          brand="NestFood"
          price={200}
          discount={5}
        />
        <DealsOfDayComponent
          image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
          name='Organic Red Rice'
          brand="NestFood"
          price={200}
          discount={5}
        />
        {
          !isMobile &&
          <DealsOfDayComponent
            image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
            name='Organic Red Rice'
            brand="NestFood"
            price={200}
            discount={5}
          />
        }
      </div>
    </div>
  )
}


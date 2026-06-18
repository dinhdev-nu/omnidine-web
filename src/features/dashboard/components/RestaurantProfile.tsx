import { forwardRef } from "react"

import { RestaurantProfileRegistrationForm } from "./RestaurantProfileRegistrationForm"

export const RestaurantProfile = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <RestaurantProfileRegistrationForm />
    </div>
  )
})

RestaurantProfile.displayName = "RestaurantProfile"

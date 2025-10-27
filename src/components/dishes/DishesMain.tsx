import DishList from "./DishList"

interface Props {
  categoryId: number
}

const DishesMain = ({ categoryId }: Props) => {

  return (
    <DishList categoryId={categoryId} />
  )
}

export default DishesMain
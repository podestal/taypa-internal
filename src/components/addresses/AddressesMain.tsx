import useGetAddressesByCustomer from "../../hooks/api/address/useGetAddressesByCustomer";
import useAuthStore from "../../store/useAuthStore";
import CreateAddress from "./CreateAddress";

interface Props {
    addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }
    setAddressInfo: (addressInfo: {
        id: number;
        street: string;
        reference: string;
        is_primary: boolean;
        customer: number;
    }) => void
    customerInfo: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    }
    handleNextStep: () => void
}


const AddressesMain = ({ addressInfo, setAddressInfo, customerInfo, handleNextStep }: Props) => {
    const access = useAuthStore(s => s.access) || ''
    const { data: addresses, isLoading, error } = useGetAddressesByCustomer({ access: access, customerId: customerInfo.id })
    
  return (
    <>
        <>
            {console.log('addresses', addresses)}
        </>
        {/* <CreateAddress 
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            customerInfo={customerInfo}
            handleNextStep={handleNextStep}
        /> */}
    </>
  )
}

export default AddressesMain
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
    
  return (
    <>
        <>
            {console.log('customer id', customerInfo.id)}
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
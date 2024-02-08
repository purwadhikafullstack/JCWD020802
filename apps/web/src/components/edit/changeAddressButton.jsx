import { useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Step, Stepper } from "@material-tailwind/react";
import { PinLocation } from "../form/pinLocation";
import { useDispatch } from "react-redux";
import { setPosition, setSelectedAddress, setSelectedCity, setSelectedProvince } from "../../redux/positionSlice";
import { ChangeAddress } from "./changeAddress";

export function ChangeAddressButton({ item, handleAddressUpdate }) {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0)
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const dispatch = useDispatch();

    const handleOpen = (address) => {
        dispatch(setSelectedAddress(address))
        dispatch(setSelectedProvince({ label: address.City.Province.province, value: address.City.ProvinceId }))
        dispatch(setSelectedCity({ label: `${address.City.type} ${address.City.city_name}`, value: address.CityId }))
        dispatch(setPosition([address.latitude, address.longtitude]))
        setOpen(true)
    }
    const handleClose = () => {
        dispatch(setSelectedProvince(null))
        dispatch(setSelectedCity(null))
        dispatch(setPosition([-6.905977, 107.613144]))
        setOpen(false)
    }
    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    useEffect(() => {
        if (!open) {
            setActiveStep(0)
        }
    }, [open]);

    return (
        <>
            <Button onClick={() => handleOpen(item)} className="w-full bg-green-600 hover:bg-green-300">
                Change Address
            </Button>
            <Dialog open={open} handler={handleClose} className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                    Change Address
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <Stepper 
                        className="w-3/4"
                        activeStep={activeStep}
                        lineClassName="bg-green-200"
                        activeLineClassName="bg-green-600"
                        isLastStep={(value) => setIsLastStep(value)}
                        isFirstStep={(value) => setIsFirstStep(value)}
                    >
                        <Step onClick={() => setActiveStep(0)} className="bg-green-200" activeClassName="bg-green-600" completedClassName="bg-green-600">1</Step>
                        <Step onClick={() => setActiveStep(1)} className="bg-green-200" activeClassName="bg-green-600" completedClassName="bg-green-600">2</Step>
                    </Stepper>
                </div>
                <DialogBody id="custom-dialog-content">
                    <div className="mx-5">
                        {
                            activeStep == 0 ?
                            <PinLocation /> :
                            <ChangeAddress handleClose={handleClose} handleAddressUpdate={handleAddressUpdate} />
                        }
                    </div>
                </DialogBody>
                <DialogFooter className="flex justify-between">
                    <Button onClick={handlePrev} disabled={isFirstStep}>
                        Prev
                    </Button>
                    <Button onClick={handleNext} disabled={isLastStep}>
                        Next
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
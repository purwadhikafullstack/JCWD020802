import { useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Step, Stepper } from "@material-tailwind/react";
import { AddAddress } from "./addAddress"
import { PinLocation } from "../../form/pinLocation";
import { useSelector } from "react-redux";

export function DialogAddress() {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0)
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const position = useSelector((state) => state.position.value);
    
    const isMobile = window.innerWidth <= 640

    const handleOpen = () => setOpen(!open)
    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    useEffect(() => {
        if (!open) {
            setActiveStep(0)
        }
    }, [open]);

    return (
        <>
            <Button onClick={handleOpen} variant="gradient">
                Add New Address
            </Button>
            <Dialog open={open} handler={handleOpen} size="" className={`flex flex-col ${isMobile ? 'max-h-full overflow-y-scroll' : ''}`}>
                <DialogHeader className="flex items-center justify-center">
                    Add Address
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <Stepper 
                        className="w-3/4"
                        activeStep={activeStep}
                        isLastStep={(value) => setIsLastStep(value)}
                        isFirstStep={(value) => setIsFirstStep(value)}
                    >
                        <Step>1</Step>
                        <Step>2</Step>
                    </Stepper>
                </div>
                <DialogBody id="custom-dialog-content">
                    <div className="mx-5">
                        {activeStep == 0 ?
                            <PinLocation
                                isMobile={isMobile}
                                position={position}
                            /> :
                            <AddAddress 
                                pinLatitude={position[0]} 
                                pinLongtitude={position[1]} 
                                isMobile={isMobile}
                                handleOpen={handleOpen}
                            />
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
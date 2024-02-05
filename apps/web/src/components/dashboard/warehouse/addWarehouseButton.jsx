import { useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Step, Stepper, Typography } from "@material-tailwind/react";
import { AddWarehouse } from "./addWarehouse"
import { PinLocation } from "../../form/pinLocation";
import { useDispatch } from "react-redux";
import { setPosition, setSelectedCity, setSelectedProvince } from "../../../redux/positionSlice";
import { FaPlus } from "react-icons/fa";

export function AddWarehouseButton({ handleWarehouseUpdate }) {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0)
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const dispatch = useDispatch()

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        dispatch(setSelectedProvince(null))
        dispatch(setSelectedCity(null))
        dispatch(setPosition([-6.905977, 107.613144]))
        setOpen(false);
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
            <div className="w-full">
                <Button onClick={handleOpen} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-300">
                    <FaPlus />
                    <Typography variant="h6" className="text-xs">New Warehouse</Typography>
                </Button>
            </div>
            <Dialog open={open} handler={handleClose} size="md" className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                   Add Warehouse
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
                            <AddWarehouse handleClose={handleClose} handleWarehouseUpdate={handleWarehouseUpdate} />
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
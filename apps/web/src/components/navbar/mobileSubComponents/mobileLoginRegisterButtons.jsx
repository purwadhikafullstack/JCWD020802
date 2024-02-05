import { Button } from "@material-tailwind/react";

export function MobileLoginRegisterButttons({list}) {
    return (
        <div className="mt-5">
            {list}
            <div className="flex items-center gap-x-1">
                <Button fullWidth variant="outlined" size="sm" color="brown">
                    <span>Log In</span>
                </Button>
                <Button fullWidth variant="gradient" size="sm" color="brown">
                    <span>Sign Up</span>
                </Button>
            </div>
        </div>
    )
}
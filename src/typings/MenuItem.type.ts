import { SvgIconComponent } from "@mui/icons-material"
import { User } from "./User.type"
import { Dispatch, SetStateAction } from "react"

export type MenuItem = {
    Icon: SvgIconComponent,
    route: string,
    label: string,
    logout?: (setContextUser: Dispatch<SetStateAction<User | null>>) => void
}
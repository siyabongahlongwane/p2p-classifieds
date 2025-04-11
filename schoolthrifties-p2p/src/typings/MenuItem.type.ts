import { SvgIconComponent } from "@mui/icons-material"
import { User } from "./User.type"

export type MenuItem = {
    Icon: SvgIconComponent,
    route: string,
    label: string,
    logout?: (user: User | null) => void
}
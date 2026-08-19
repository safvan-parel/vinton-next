import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";

export default function RegisterDisabled() {
    redirect(ROUTES.LOGIN);
}

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    return <ProfileForm user={user} />;
}

import BlogPostManagementPanel from "./BlogPostManagementPanel";
import MilestoneManagementPanel from "./MilestoneManagementPanel";

export default function AdminPanel() {
    return (
        <>
            <BlogPostManagementPanel/>
            <MilestoneManagementPanel/>
        </>
    );
}

import Link from "next/link";
import { ROUTES, sliderEditPath } from "@/lib/admin-routes";
import { APP_TIMEZONE } from "@/lib/timezone";
import ConfirmForm from "@/components/backend/ConfirmForm";
import AdminForm from "@/components/backend/AdminForm";
import { changeSliderStatusAction, deleteSliderAction } from "./actions";

function formatDate(value) {
    return new Date(value).toLocaleString("en-IN", {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function SliderTable({ sliders }) {
    if (!sliders.length) {
        return (
            <p className="mb-0">
                No sliders yet.{" "}
                <Link href={ROUTES.SLIDER_CREATE}>Add the first slider</Link>.
            </p>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sliders.map((slider) => (
                        <tr key={slider.id}>
                            <td>
                                {slider.image ? (
                                    <img src={slider.image} alt={slider.title} className="admin-thumb" />
                                ) : (
                                    <span className="text-muted">No image</span>
                                )}
                            </td>
                            <td>{slider.title}</td>
                            <td className="admin-desc">{slider.desc}</td>
                            <td>
                                <span className={`badge ${slider.active ? "bg-success" : "bg-secondary"}`}>
                                    {slider.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="text-nowrap">{formatDate(slider.createdAt)}</td>
                            <td>
                                <div className="admin-actions">
                                    <Link href={sliderEditPath(slider.id)} className="btn btn-sm btn-outline-primary">
                                        Edit
                                    </Link>

                                    <AdminForm action={changeSliderStatusAction}>
                                        <input type="hidden" name="id" value={slider.id} />
                                        <button type="submit" className="btn btn-sm btn-outline-secondary">
                                            {slider.active ? "Deactivate" : "Activate"}
                                        </button>
                                    </AdminForm>

                                    <ConfirmForm
                                        action={deleteSliderAction}
                                        message="Delete this slider?"
                                    >
                                        <input type="hidden" name="id" value={slider.id} />
                                        <button type="submit" className="btn btn-sm btn-outline-danger">
                                            Delete
                                        </button>
                                    </ConfirmForm>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

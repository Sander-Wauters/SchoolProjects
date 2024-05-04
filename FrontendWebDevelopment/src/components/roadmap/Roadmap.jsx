import useSWR from "swr";
import { getAll } from "../../api";
import AsyncData from "../util/AsyncData";
import Milestone from "./Milestone";

export default function Roadmap() {
    const { data: milestones=[], isLoading, error } = useSWR("milestones", getAll); 

    return (
        <>
            <AsyncData loading={isLoading} error={error}>
                {milestones.map((milestone) => (
                    <Milestone key={milestone.id} {...milestone} />
                ))}
            </AsyncData>
        </>
    );
}


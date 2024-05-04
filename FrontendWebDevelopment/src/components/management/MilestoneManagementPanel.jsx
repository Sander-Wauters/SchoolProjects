import { useCallback, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAll, updateById, deleteById, post } from "../../api";
import { useThemeContext } from "../../contexts/Theme.context";
import AsyncData from "../util/AsyncData";
import Error from "../util/Error";
import MilestoneForm from "../roadmap/MilestoneForm";
import MilestoneHeader from "../roadmap/MilestoneHeader";

export default function MilestoneManagementPanel() {
    const { theme } = useThemeContext();

    const [selectedMilestone, setSelectedMilestone] = useState({ id: -1, index: -1, selected: "" });
    const [editingMilestone, setEditingMilestone] = useState(false);

    const { data: milestones=[], milestonesIsLoading, milestonesError } = useSWR("milestones", getAll);
    const { trigger: saveMilestone, error: saveMilestoneError } = useSWRMutation("milestones", post);
    const { trigger: updateMilestone, error: updateMilestoneError } = useSWRMutation("milestones", updateById);
    const { trigger: deleteMilestone, error: deleteMilestoneError } = useSWRMutation("milestones", deleteById);
    
    const handleSelectMilestone = (event) => {
        const id = parseInt(event.target.value);
        const index = milestones.findIndex(el => el.id === id);
        setSelectedMilestone({ id, index, selected: String(id) });
        setEditingMilestone(false);
    };

    const handleEditMilestone = () => {
        if (selectedMilestone.id !== -1 && selectedMilestone.index !== -1) {
            setEditingMilestone(!editingMilestone);
        }
    };

    const handleSaveMilestone = useCallback(async (data) => {
        const { tag, accomplished, imagePath, title, content } = data;

        await saveMilestone({
            tag,
            accomplished,
            imagePath: `/images/${imagePath}`,
            title,
            content,
        });
    }, [saveMilestone]);

    const handleUpdateMilestone = useCallback(async (data) => {
        if (selectedMilestone.id !== -1) {
            const { tag, accomplished, imagePath, title, content } = data;

            await updateMilestone({
                id: selectedMilestone.id,
                tag,
                accomplished,
                imagePath,
                title,
                content,
            });

            setSelectedMilestone({ id: -1, index: -1, selected: "" });
        }
    }, [updateMilestone, selectedMilestone]);

    const handleRemoveMilestone = useCallback(async () => {
        if (selectedMilestone.id !== -1 && confirm("Are you sure you want to remove this milestone?")) {
            await deleteMilestone(selectedMilestone.id);
            setSelectedMilestone({ id: -1, index: -1, selected: "" });
        }
    }, [deleteMilestone, selectedMilestone]);

    return (
        <div className={`managementPanel-${theme}`}>
            <h3>Add new milestone.</h3>
            <MilestoneForm onSubmit={handleSaveMilestone} submitError={saveMilestoneError} props={{ tag:"", accomplished:false, title:"", content:"", imagePath:"" }}/>
            <h3>Change existing milestone.</h3>
            <AsyncData loading={milestonesIsLoading} error={milestonesError}>
                <Error error={deleteMilestoneError} data-cy={"managementPanelMilestones_deleteError"}/>
                <label htmlFor="milestoneId">ID: </label>
                <select id="milestoneId" name="milestoneId" value={selectedMilestone.selected} onChange={handleSelectMilestone} className={`idSelector-${theme}`} data-cy={"managementPanelMilestones_idSelector"}>
                    <option value="">-</option>
                    {milestones.map(({id}) => (
                        <option key={id} value={id}>{id}</option>
                    ))}
                </select>
                <button type="button" onClick={handleEditMilestone} className={`buttonEdit-${theme}`} data-cy={"managementPanelMilestones_edit"}>
                    Edit
                </button>
                <button type="button" onClick={handleRemoveMilestone} className={`buttonRemove-${theme}`} data-cy={"managementPanelMilestones_delete"}>
                    Delete
                </button>
                {editingMilestone && selectedMilestone.index !== -1 ? 
                    <MilestoneForm onSubmit={handleUpdateMilestone} submitError={updateMilestoneError} props={milestones[selectedMilestone.index]}/> 
                    : null
                }
                {milestones.map((milestone) => (
                    <MilestoneHeader key={milestone.id} {...milestone}/>
                ))}
            </AsyncData>
        </div>
    );
}

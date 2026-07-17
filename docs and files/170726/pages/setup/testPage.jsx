import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import useRole from "@/hooks/setup/useRole";

const DemoPage = () => {
  const { showBusy, showToastMessage, showConfirm, showDone, remarks, setRemarks } =
    useRole();

  return (
    <Card title="Role Management Setup" className="shadow-2 border-round p-2">
      <p className="m-0 mb-4 text-600">
        Configure roles and test UI notifications.
      </p>

      <div className="grid">
        <div className="col-12 mb-4">
          <label htmlFor="remarks" className="block text-900 font-medium mb-2">
            Remarks / Notes
          </label>
          <InputTextarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={5}
            cols={30}
            autoResize
            placeholder="Enter any additional notes here..."
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          label="Show Loading"
          icon="pi pi-spin pi-spinner mr-2"
          onClick={() => showBusy(true)}
          outlined
        />
        <Button
          label="Success"
          icon="pi pi-check mr-2"
          severity="success"
          onClick={() => showToastMessage("success", "Success", "Action completed!")}
        />
        <Button
          label="Error"
          icon="pi pi-times mr-2"
          severity="danger"
          onClick={() => showToastMessage("error", "Error", "Something went wrong.")}
        />
        <Button
          label="Confirm"
          icon="pi pi-question-circle mr-2"
          severity="warning"
          onClick={() => showConfirm()}
        />
        <Button
          label="Done"
          icon="pi pi-verified mr-2"
          severity="info"
          onClick={() => showDone()}
        />
      </div>
    </Card>
  );
};

export default DemoPage;

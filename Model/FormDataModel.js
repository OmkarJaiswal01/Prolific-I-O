const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    IOPS_Threshold_for_Scaling: { type: String, required: false },
    Expected_Peak_IOPS: { type: String, required: false },
    Dynamic_IOPS_Configuration: { type: String, required: false },
    frequency: { type: String, required: false },
    time: { type: String, required: false },
    Default_VPC: { type: String, required: false },
    Security_Group_Name: { type: String, required: false },
    Placement_Group_Name: { type: String, required: false },
    AWS_Region: { type: String, required: false },
    CPU_Threshold_for_Dynamic_IOPS: { type: String, required: false },
    PIOSA_Server_Name: { type: String, required: false },
    PIOSA_Server_Login_Details: { type: String, required: false },
    Accelerated_Server_Name: { type: String, required: false },
    Count_of_EBS_Volumes: { type: String, required: false },
    Total_EBS_Volume_Size: { type: String, required: false },
    VPC_CIDR: { type: String, required: false },
    dpic: { type: String, required: false } // Field to store the uploaded file path
});

const FormDataModel = mongoose.model('Form', FormDataSchema);

module.exports = FormDataModel;

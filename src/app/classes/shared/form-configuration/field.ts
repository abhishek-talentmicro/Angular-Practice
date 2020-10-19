export class Field {
    label: string;
    field_name: string;
    placeholder: string;
    control_type: number;
    display_label: number;
    display_label_same_line: number;
    label_width: number;
    mandatory: number;
    field_width: number;
    sequence: number;
    min_length: number;
    max_length: number;
    min_value: number;
    max_value: number;

    constructor(obj = {
        label: null,
        field_name: null,
        placeholder: null,
        control_type: null,
        display_label: null,
        display_label_same_line: null,
        label_width: null,
        mandatory: null,
        field_width: null,
        sequence: null,
        min_length: null,
        max_length: null,
        min_value: null,
        max_value: null
    }) {
        this.label = obj.label;
        this.field_name = obj.field_name;
        this.placeholder = obj.placeholder
        this.control_type = obj.control_type;
        this.display_label = obj.display_label;
        this.display_label_same_line = obj.display_label_same_line;
        this.label_width = obj.label_width;
        this.mandatory = obj.mandatory;
        this.field_width = obj.field_width;
        this.sequence = obj.sequence;
        this.min_length = obj.min_length;
        this.max_length = obj.max_length;
        this.min_value = obj.min_value;
        this.max_value = obj.max_value;
    }
}
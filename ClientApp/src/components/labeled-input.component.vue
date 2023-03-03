<template>
    <div class="generic-ui__labeled-input__container">
        <span>{{ label }}</span>
        <div class="generic-ui__labeled-input__data-container">
            <input 
                :readonly="!editMode" 
                :value="boundValue" 
                :placeholder="label"
                :type="inputType"
                @input="onInputChange"
            >
            <span v-if="suffix">{{ suffix }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'LabeledInput',
        props: {
            boundValue: {
                type: [String, Number, Date],
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            inputType: {
                type: String,
                required: true
            },
            suffix: {
                type: String,
                required: false
            },
            onInputCallback: {
                type: Function,
                required: true,
            },
        },
        methods: {
            onInputChange(event: any) {
                this.onInputCallback(event.target.value);
            },
        }
    });
</script>

<style scoped lang="scss">
    .generic-ui__labeled-input__container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-basis: calc(33.33% - 20px);
        gap: 0.5rem;

        span {
            color: white;
            font-size: 0.6rem;
            font-weight: 800;
        }

        .generic-ui__labeled-input__data-container {
            height: 5rem;
            min-width: 5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            border-radius: 1rem;
            color: white;
            background-color: rgb(84, 104, 235);


            input {
                width: 100%;
                border: none;
                border-bottom: 1px solid #999;
                color: white;
                background-color: transparent;
                text-overflow: ellipsis;
                text-align: center;
                font-size: 2rem;
                font-weight: 600;
    
                &:read-only {
                    border-bottom: none;
                    pointer-events: none;
                }
            }
        }
    }
</style>
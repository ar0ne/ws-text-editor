"use client";

export default function TextEditor({ value }) {

    const handleChange = (event) => {
        console.log(event);
    };

    return (
        <div className="text-editor">
            <textarea 
                id="editor"
                name="editor"
                value={value}
                onChange={handleChange}
                rows={4}
                cols={40}
                placeholder="..."
            />
        </div>
    );
}
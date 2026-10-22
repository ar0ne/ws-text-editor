"use client";

import { useState, useEffect } from 'react';

import TextMap from '../utils/text-map';

export default function TextEditor({ value }) {

    const [text, setText] = useState(value);
    const [textMap] = useState(new TextMap());

    const handleChange = (event) => {
        setText(event.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("User stopped typing! Save or API call with:", text);
            let diff = textMap.diffText(text);
            console.log([...diff.added]);
            console.log([...diff.removed]);
            textMap.set(textMap.applyDiff(diff));
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div className="text-editor">
            <textarea 
                id="editor"
                name="editor"
                value={text}
                onChange={handleChange}
                rows={4}
                cols={40}
                placeholder="..."
            />
        </div>
    );
}
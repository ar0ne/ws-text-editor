"use client";

import { useState, useEffect } from 'react';

import { TextTree } from '../utils/strings';

export default function TextEditor({ value }) {

    const [text, setText] = useState(value);
    const [textTree] = useState(new TextTree());

    const handleChange = (event) => {
        setText(event.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("User stopped typing! Save or API call with:", text);
            let diff = textTree.diffText(textTree.getMap(), text);
            console.log([...diff.added]);
            console.log([...diff.removed]);
            textTree.setMap(textTree.applyDiff(textTree.getMap(), diff));
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
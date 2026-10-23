"use client";

import { useState, useEffect } from 'react';

import TextMap from '../utils/text-map';
import { messageService } from '../services/message-service';


export default function TextEditor({ value }) {

    const [text, setText] = useState(value);
    const [textMap] = useState(new TextMap());

    const handleChange = (event) => {
        setText(event.target.value);
    };

    function enqueueDiff(diff) {
        if (diff.added.size > 0) {
            messageService.enqueueMessage({
                type: "add",
                diff: [...diff.added]
            });
        }
        if (diff.removed.size > 0) {
            messageService.enqueueMessage({
                type: "del",
                diff: [...diff.removed]
            });
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("User stopped typing!");
            let diff = textMap.diffText(text);
            enqueueDiff(diff);
            textMap.data = textMap.applyDiff(diff);
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

import { TreeMap, Queue } from 'data-structure-typed';


const TEXT_TOKENIZER_REGEX = /[a-zA-Z0-9]+|\s+|[^a-zA-Z0-9\s]+/g;

export default class TextMap {

    #map;

    constructor() {
        this.#map = new TreeMap();
    }

    tokenize(text) {
        return text.match(TEXT_TOKENIZER_REGEX) ?? [];
    }

    get map() {
        return this.#map;
    }

    set map(newMap) {
        this.#map = newMap;
    }

    diffText(newText) {
        const oldEntries = [...this.map]
            .filter(([key]) => typeof key === 'number' && key > 0 && key < 1)
            .map(([position, text]) => ({ position, text }));

        const tokens = this.tokenize(newText);
        const n = oldEntries.length;
        const m = tokens.length;

        const dp = Array.from({ length: n + 1 }, () =>
            Array(m + 1).fill(0)
        );

        for (let i = n - 1; i >= 0; i--) {
            for (let j = m - 1; j >= 0; j--) {
            dp[i][j] = oldEntries[i].text === tokens[j]
                ? 1 + dp[i + 1][j + 1]
                : Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }

        const matched = Array(m).fill(null);
        const matchedOld = new Set();

        let i = 0;
        let j = 0;

        while (i < n && j < m) {
            if (oldEntries[i].text === tokens[j]) {
                matched[j] = oldEntries[i].position;
                matchedOld.add(i);
                i++;
                j++;
            } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                i++;
            } else {
                j++;
            }
        }

        const added = new TreeMap();
        const removed = new TreeMap();

        for (let i = 0; i < n; i++) {
            if (!matchedOld.has(i)) {
                removed.set(oldEntries[i].position, oldEntries[i].text);
            }
        }

        for (let j = 0; j < m;) {
            if (matched[j] !== null) {
                j++;
                continue;
            }

            const start = j;
            while (j < m && matched[j] === null) j++;

            const left = start > 0 ? matched[start - 1] ?? 0 : 0;
            const right = j < m ? matched[j] ?? 1 : 1;
            const count = j - start;

            for (let k = start; k < j; k++) {
                const position =
                    left + (right - left) * (k - start + 1) / (count + 1);

                added.set(position, tokens[k]);
            }
        }

        return { added, removed };
    }

    applyDiff(diff) {
        const updated = new TreeMap();

        // Copy everything from the old map, preserving existing keys.
        for (const [key, value] of this.map) {
            updated.set(key, value);
        }

        // Remove obsolete entries.
        for (const [key] of diff.removed) {
            updated.delete(key);
        }

        // Insert new entries.
        for (const [key, value] of diff.added) {
            updated.set(key, value);
        }

        return updated;
    }

    toString() {
        return Array.from(this.get().values()).join('');
    }

}

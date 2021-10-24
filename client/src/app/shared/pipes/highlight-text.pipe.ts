import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})

export class HighlightTextPipe implements PipeTransform {

    transform(value: string, args: string[]): any {
        if (args && value) {
            value = String(value);
            for (const arg of args) {
                if (arg && arg.trim().length > 0) {
                    const startIndex = value.toLowerCase().indexOf(arg.toLowerCase());
                    if (startIndex !== -1) {
                        const matchingString = value.substr(startIndex, arg.length);
                        return value.replace(matchingString, '<mark>' + matchingString + '</mark>');
                    }
                }
            }

        }
        return value;
    }
}
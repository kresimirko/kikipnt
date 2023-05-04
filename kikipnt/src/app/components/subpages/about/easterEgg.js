import { Subpage } from '../base';
import { MainApp } from '../../../main';

export class SubpageEasterEgg extends Subpage {
    /**
     * @param {MainApp} mainApp
     */
    constructor(mainApp) {
        // https://oneshot.fandom.com/wiki/Niko

        const rootContainer = document.createElement('div');
        super('easteregg', '#/about/easteregg', rootContainer, mainApp);

        this.rootContainer.classList.add('space-y-2', 'flex', 'flex-col', 'items-center');

        const eeImg = document.createElement('img');
        eeImg.classList.add('pixelated', 'w-[192px]', 'h-[192px]');

        const eeImgLinkNormal = 'https://kresimirko.tixte.co/r/niko1.webp';
        const eeImgLinkSecondary = 'https://kresimirko.tixte.co/r/niko2.webp';
        new Image().src = eeImgLinkSecondary; // https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
        eeImg.src = eeImgLinkNormal;

        mainApp.statusLabel.addLoc(eeImg, 'ui.sp.easteregg.status');
        this.rootContainer.appendChild(eeImg);

        let on = false;
        if (window.matchMedia('(hover: none)').matches) {
            eeImg.addEventListener('click', () => {
                on = !on;
                eeImg.src = on ? eeImgLinkSecondary : eeImgLinkNormal;
            });
        } else {
            eeImg.addEventListener('mouseover', () => {
                eeImg.src = eeImgLinkSecondary.toString();
            });
            eeImg.addEventListener('mouseleave', () => {
                eeImg.src = eeImgLinkNormal.toString();
            });
        }

        const eeLabel = document.createElement('span');
        eeLabel.classList.add('text-xl');
        eeLabel.innerText = 'Niko!!';
        this.rootContainer.appendChild(eeLabel);
    }
}

/**
 * 一直往上寻找 直到找到dtc属性
 * @param element
 * @param id
 * @returns {null|*}
 */
function findElementByDtcUpwards(element) {
    if (!element) {
        return null;
    }
    if (element.getAttribute("dtc")) {
        return element;
    }
    return findElementByDtcUpwards(element.parentElement);
}

let isKeyPressed = false;

const onKeyDown=(event)=>{
    if ( keys.includes(event.key.toUpperCase()) ) {
        isKeyPressed = true;
    }
}

const onKeyUp=(event)=>{
    if (keys.includes(event.key.toUpperCase())) {
        isKeyPressed = false;
    }
}

const onBlur=()=>{
    isKeyPressed = false
}

const onClick=(event)=>{
    if( isKeyPressed ){
        // event.preventDefault();
        // event.stopPropagation()
        const clickedElement = event.target;
        let dtc = null
        if( clickedElement.getAttribute("dtc") ){
            dtc = clickedElement.getAttribute("dtc")
        }else if( findElementByDtcUpwards(clickedElement) ) {
            dtc = findElementByDtcUpwards(clickedElement).getAttribute("dtc")
        }

        //当前节点没有dtc
        if( dtc ){
            fetch(`http://localhost:9001/dom-to-code?dtc=${dtc}`)
        }
    }
}


const keys = ['CONTROL','META']

/**
 * 监听页面是否按住了"C"键盘并且点击了页面
 */
function init(){
    if( !window.LOCAL_SERVICE ){
        window.addEventListener('blur', onBlur);

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('click', onClick)
    }
}

function clearDtc(){
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('click', onClick);
}

export default init
export { clearDtc }

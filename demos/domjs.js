// 添加生成图片的按钮
var createImg = `
    <span class='creat-img' id='creat-img'>生成图片</span>
`;
var pspan = document.createElement('p');
pspan.setAttribute('id', 'pspan');
pspan.setAttribute('class', 'pspan');
pspan.innerHTML = createImg;
document.body.appendChild(pspan);

var createImgBox = `
    <div>
        <img src='' id='imgbase64'>
        <p>电脑端：右键保存图片<p>
        <p>手机端：长按保存图片<p>
        <p class='close-tip' id='close-tip'>关闭<p>                
    </div>
`

var createBox = document.createElement('div');
createBox.setAttribute('id', 'create-box');
createBox.setAttribute('class', 'create-box');
createBox.innerHTML = createImgBox;
document.body.appendChild(createBox);
document.getElementById('creat-img').addEventListener('click', () => {
    document.getElementById('create-box').style.display = 'block';
    document.getElementById('imgbase64').setAttribute('src', myDiagram.apiPreviewImage("white",2))
})

document.getElementById('close-tip').addEventListener('click', () => {
    document.getElementById('create-box').style.display = 'none';
})

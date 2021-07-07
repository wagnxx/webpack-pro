import 'bootstrap/dist/css/bootstrap.min.css';
import './css/header.css';
import menus from '../../config/menus';

const types = ['one-one', 'one-many', 'many-many', 'one'];

function init() {
  setMenus(menus);
  const selectElement = document.getElementById('inputGroupSelect01');
  selectElement.addEventListener('change', selectChangeHandle);
}

function selectChangeHandle(e) {
  let selectedId = types.find((typ) => typ === this.value);
  let unselecteds = types.filter((typ) => typ !== this.value);
  
  /**
   * 子页，由select option 选择
   */
  // import './utils/one-one';
  // import './utils/many-many';
  // import './utils/one';
  // import './utils/one-many';

  import(`./utils/${selectedId}`).then((_) => {
    const app = _.default;
    app();
  });

  unselecteds.forEach((id) => {
    const itemElement = document.getElementById(id);
    itemElement && itemElement.classList.add('hide');
  });

  const selectedItemElement = document.getElementById(selectedId);
  selectedItemElement && selectedItemElement.classList.remove('hide');
}

function setMenus(menus) {
  let _html = menus
    .map((item) => {
      return `<li key=${item.key}><a href=${item.link}>${item.text}</a></li>`;
    })
    .join('');

  document.querySelector('header ul').innerHTML = _html;
}

window.addEventListener('load', init);

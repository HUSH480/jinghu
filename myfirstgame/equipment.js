"use strict";

window.EquipmentSystem = (() => {

    // ==============================
    // 1. 装备数据库
    // ==============================

    const database = [
        {
            id: "wooden_sword",
            name: "桃木剑",
            type: "weapon",
            rarity: "普通",
            attack: 5,
            defense: 0,
            price: 50,
            description: "一把普通的桃木剑，适合初入江湖的侠客。"
        },
        {
            id: "iron_sword",
            name: "精铁剑",
            type: "weapon",
            rarity: "优秀",
            attack: 15,
            defense: 0,
            price: 200,
            description: "精铁打造的长剑，锋利耐用。"
        },
        {
            id: "frost_sword",
            name: "寒霜剑",
            type: "weapon",
            rarity: "稀有",
            attack: 30,
            defense: 0,
            price: 800,
            description: "剑刃泛着寒光，能够大幅提升攻击力。"
        },
        {
            id: "dragon_sword",
            name: "斩龙剑",
            type: "weapon",
            rarity: "传说",
            attack: 50,
            defense: 5,
            price: 2500,
            description: "传闻曾有侠客持此剑斩杀恶蛟。"
        },
        {
            id: "cloth_robe",
            name: "粗布衣",
            type: "armor",
            rarity: "普通",
            attack: 0,
            defense: 3,
            price: 40,
            description: "最普通的衣服，聊胜于无。"
        },
        {
            id: "leather_armor",
            name: "软皮甲",
            type: "armor",
            rarity: "优秀",
            attack: 0,
            defense: 10,
            price: 180,
            description: "皮革制成，可以抵挡部分伤害。"
        },
        {
            id: "silver_armor",
            name: "银纹护甲",
            type: "armor",
            rarity: "稀有",
            attack: 0,
            defense: 25,
            price: 700,
            description: "银纹遍布甲身，防护能力出众。"
        },
        {
            id: "jade_pendant",
            name: "青玉佩",
            type: "accessory",
            rarity: "优秀",
            attack: 5,
            defense: 2,
            price: 150,
            description: "温润的青玉佩，蕴含微弱灵气。"
        },
        {
            id: "dragon_ring",
            name: "龙纹戒",
            type: "accessory",
            rarity: "稀有",
            attack: 12,
            defense: 8,
            price: 600,
            description: "刻有古老纹路的戒指，蕴含奇异力量。"
        },
        {
            id: "heaven_ring",
            name: "天命戒",
            type: "accessory",
            rarity: "传说",
            attack: 25,
            defense: 15,
            price: 2000,
            description: "一枚来历神秘的戒指，攻防兼备。"
        }
    ];

    // ==============================
    // 2. 玩家背包和装备栏
    // ==============================

    let nextInstanceId = 1;

    const inventory = [];

    const equipped = {
        weapon: null,
        armor: null,
        accessory: null
    };

    const slotNames = {
        weapon: "武器",
        armor: "防具",
        accessory: "饰品"
    };

    // ==============================
    // 3. 创建装备实例
    // ==============================

    function createItem(id) {
        const template = database.find(item => item.id === id);

        if (!template) {
            return null;
        }

        return {
            ...template,
            instanceId: nextInstanceId++
        };
    }

    // ==============================
    // 4. 获取装备信息
    // ==============================

    function getDatabase() {
        return database.map(item => ({ ...item }));
    }

    function findById(id) {
        const item = database.find(item => item.id === id);
        return item ? { ...item } : null;
    }

    function getInventory() {
        return inventory.map(item => ({ ...item }));
    }

    function getEquipped() {
        const result = {};

        for (const slot of Object.keys(equipped)) {
            result[slot] = equipped[slot]
                ? { ...equipped[slot] }
                : null;
        }

        return result;
    }

    // ==============================
    // 5. 获得装备
    // ==============================

    function addItem(id, amount = 1) {
        const count = Math.max(1, Math.floor(amount));
        let added = 0;

        for (let i = 0; i < count; i++) {
            const item = createItem(id);

            if (!item) {
                break;
            }

            inventory.push(item);
            added++;
        }

        return added;
    }

    // ==============================
    // 6. 穿戴装备
    // ==============================

    function equipItem(instanceId) {
        const index = inventory.findIndex(
            item => item.instanceId === instanceId
        );

        if (index === -1) {
            return {
                success: false,
                message: "背包中没有找到这件装备。"
            };
        }

        const item = inventory[index];
        const slot = item.type;

        if (!Object.prototype.hasOwnProperty.call(equipped, slot)) {
            return {
                success: false,
                message: "这件物品无法穿戴。"
            };
        }

        // 如果该部位已经穿戴装备，将旧装备放回背包。
        if (equipped[slot]) {
            inventory.push(equipped[slot]);
        }

        equipped[slot] = item;
        inventory.splice(index, 1);

        return {
            success: true,
            message: `已装备：${item.name}`
        };
    }

    // ==============================
    // 7. 卸下装备
    // ==============================

    function unequipItem(slot) {
        if (!Object.prototype.hasOwnProperty.call(equipped, slot)) {
            return {
                success: false,
                message: "装备部位不存在。"
            };
        }

        if (!equipped[slot]) {
            return {
                success: false,
                message: "这个部位没有装备物品。"
            };
        }

        inventory.push(equipped[slot]);

        const name = equipped[slot].name;

        equipped[slot] = null;

        return {
            success: true,
            message: `已卸下：${name}`
        };
    }

    // ==============================
    // 8. 计算装备属性
    // ==============================

    function getStats() {
        const result = {
            attack: 0,
            defense: 0
        };

        for (const item of Object.values(equipped)) {
            if (!item) continue;

            result.attack += item.attack || 0;
            result.defense += item.defense || 0;
        }

        return result;
    }

    // ==============================
    // 9. 查询装备是否穿戴
    // ==============================

    function isEquipped(instanceId) {
        return Object.values(equipped).some(
            item => item && item.instanceId === instanceId
        );
    }

    // ==============================
    // 10. 清空背包
    // ==============================

    function clearInventory() {
        inventory.length = 0;
    }

    // ==============================
    // 11. 对外开放接口
    // ==============================

    return {
        getDatabase,
        findById,
        getInventory,
        getEquipped,
        addItem,
        equipItem,
        unequipItem,
        getStats,
        isEquipped,
        clearInventory,
        slotNames
    };

})();
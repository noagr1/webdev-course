// קופה של "קפה פינה": מחשבת הזמנה ומדפיסה קבלה בקונסול

// ---------- הגדרות ----------
const SHOP_NAME = 'קפה פינה';
const COFFEE_PRICE = 12;
const CAKE_PRICE = 18;
const STUDENT_DISCOUNT = 0.1;
const HAPPY_HOUR_DISCOUNT = 0.2;
const HAPPY_HOUR_START = 16;
const HAPPY_HOUR_END = 18;
const VAT_RATE = 0.18;

// ---------- מחירים ----------
function priceOf(item) {
  switch (item) {
    case 'קפה':
      return COFFEE_PRICE;
    case 'עוגה':
      return CAKE_PRICE;
    default:
      console.warn(`אין בתפריט: ${item}`);
      return 0;
  }
}

// כמות תקינה היא מספר שלם, 0 או יותר
const isValidAmount = (amount) => Number.isInteger(amount) && amount >= 0;

function calculateTotal(coffees, cakes) {
  if (!isValidAmount(coffees) || !isValidAmount(cakes)) {
    console.error('כמות לא תקינה: צריך מספר שלם, 0 או יותר');
    return null;
  }
  return coffees * priceOf('קפה') + cakes * priceOf('עוגה');
}

// ---------- הנחות ----------
const isHappyHour = (hour) => hour >= HAPPY_HOUR_START && hour < HAPPY_HOUR_END;

// ההנחות לא מצטברות, לכן בודקים קודם את הגדולה
function discountRate(isStudent = false, hour = 12) {
  if (isHappyHour(hour)) return HAPPY_HOUR_DISCOUNT;
  if (isStudent) return STUDENT_DISCOUNT;
  return 0;
}

// ---------- כסף ----------
const roundMoney = (amount) => Math.round(amount * 100) / 100;
const formatPrice = (amount) => `₪${amount.toFixed(2)}`;

// ---------- קבלה ----------
function line(length = 30) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += '-';
  }
  return result;
}

function printReceipt(coffees, cakes, isStudent = false, hour = 12) {
  const subtotal = calculateTotal(coffees, cakes);
  if (subtotal === null) return; // ההזמנה לא תקינה, אין מה להדפיס

  const discount = roundMoney(subtotal * discountRate(isStudent, hour));
  const afterDiscount = subtotal - discount;
  const vat = roundMoney(afterDiscount * VAT_RATE);
  const total = roundMoney(afterDiscount + vat);

  console.log(line());
  console.log(`  ${SHOP_NAME}`);
  console.log(line());
  if (coffees > 0) console.log(`קפה ×${coffees}: ${formatPrice(coffees * COFFEE_PRICE)}`);
  if (cakes > 0) console.log(`עוגה ×${cakes}: ${formatPrice(cakes * CAKE_PRICE)}`);
  if (discount > 0) console.log(`הנחה: -${formatPrice(discount)}`);
  console.log(`מע״מ (18%): ${formatPrice(vat)}`);
  console.log(`לתשלום: ${formatPrice(total)}`);
  console.log(line());
}

// ---------- הזמנות לדוגמה ----------
printReceipt(2, 1);           // לקוח רגיל בצהריים: 49.56
printReceipt(1, 2, true, 17); // סטודנט בשעת השמחה: 45.31
printReceipt(-1, 2);          // לא תקין: מדפיס שגיאה

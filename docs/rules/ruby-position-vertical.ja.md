# ja-typography/ruby-position-vertical

[English](./ruby-position-vertical.md)

縦書きの日本語で `ruby-position: under`（Safari の `-webkit-ruby-position: after` も）を禁止します。縦書きでは、ルビが親文字の左側に付いてしまいます。

```css
.tategaki { writing-mode: vertical-rl; }
.tategaki rt { ruby-position: under; }
/**                           ↑
 * ルビが左側に付く。縦組のルビは右側が原則 */
```

## 理由

`ruby-position` は行を基準にした向き（line-relative）で決まります。CSS Ruby 1 は `over` を「ルビは親文字の line-over 側に出る」、`under` を「line-under 側に出る」と定め、図で `under` を「縦組では日本語の親文字の左にルビ」と示しています（[CSS Ruby 1, `ruby-position`](https://www.w3.org/TR/css-ruby-1/#valdef-ruby-position-under)）。縦書きのモードでは line-over が右、line-under が左です（[CSS Writing Modes 3, 6.3 Line-relative Directions](https://www.w3.org/TR/css-writing-modes-3/#line-directions)）。

JLREQ は「縦組の場合，ルビは親文字の右側，横組の場合，ルビは親文字の上側に付けるのが原則である」とし、左側（横組では下側）に付ける例は「非常に少ない」としています（[JLREQ 3.3.4 親文字のどちら側にルビを付けるか](https://www.w3.org/TR/jlreq/#choice_of_sides_for_ruby_with_respect_to_base_characters)）。

横組のページ向けに `ruby-position: under` を書いた規則（たとえばクイズで読みを下に回す）が縦書きにも当たると、たいていはルビが逆側に付きます。ブラウザーの既定値（`alternate`。1段目のルビでは `over` と同じ）のままなら右側です。

左ルビが正しい場面もあります。読みを右、意味を左に付ける両側ルビです（JLREQ Figure 117）。その場合は `ignoreSelectors` か、無効化コメントを使ってください。

対応状況：`ruby-position: over | under` は Chrome 84、Firefox 38、Safari 18.2 から使えます。古い Safari は `-webkit-ruby-position: before | after` だけを解釈します（MDN browser-compat-data）。`after` は `under` と同じに扱います。

## 縦書きの判定

スタイルシートだけを見るので、次のどれかに当たるときに報告します。

- 同じブロック、または外側の（入れ子の）ブロックが `writing-mode: vertical-rl`、`vertical-lr`、古い縦書きの値（`tb-rl`、`tb`）を指定している
- セレクターが、同じファイルの別の場所で縦書きの `writing-mode` を指定しているセレクターで始まり、そのあとに結合子が続く（`.tategaki rt`、`.tategaki > ruby rt`）

別のファイルやインラインのスタイルで縦書きにしている場合は判定できません。

## オプション

### `true`

問題とみなす例：

```css
.v { writing-mode: vertical-rl; ruby-position: under; }
```

```css
.tate { writing-mode: vertical-rl; }
.tate rt { ruby-position: under; }
```

```css
.v { writing-mode: vertical-rl; -webkit-ruby-position: after; }
```

問題としない例：

```css
.v { writing-mode: vertical-rl; ruby-position: over; }
```

```css
/* 横組 */
.quiz rt { ruby-position: under; }
```

### `ignoreSelectors: ["/regex/", "string"]`

対象外にするセレクター。たとえば両側ルビの2段目：

```json
{ "ja-typography/ruby-position-vertical": [true, { "ignoreSelectors": [".tategaki rtc"] }] }
```

## 自動修正

できません。左ルビが意図的なこともあるため、`over` への書き換えはしません。

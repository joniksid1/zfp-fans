function Info() {
  return (
    <section className="info">
      <div className="info__wrapper">
        <p className="info__text">Версия программы 1.3.0</p>
        <p className="info__text">Изменения:</p>
        <p className="info__text">
          Пользовательские изменения:<br />
          - Добавлена возможность копирования системы.<br />
          - Добавлена возможность пересчёта системы.<br />
          - Добавлена возможность указания количества кликом на количество в результатах расчёта. Обратная совместимость сохранена.<br />
          - Добавлена возможность изменения названия системы кликом на название в результатах расчёта.<br />
        </p>
        <p className="info__text">
          Исправления:<br />
          - Исправлено: Название проекта в результатах расчёта не уходит за границы экрана при переполнении.<br />

        </p>
        <p className="info__text">Версия программы 1.2.1</p>
        <p className="info__text">Изменения:</p>
        <p className="info__text">
          Пользовательские изменения:<br />
          - Добавлена возможность выбора опций для вентилятора ZFR 2,2-2E.<br />
          - Регулятор скорости при подборе теперь выбран по умолчанию (можно отменить).<br />
          - Увеличен лимит символов на ввод в название проекта и название системы.<br />
        </p>
        <p className="info__text">Версия программы 1.2.0</p>
        <p className="info__text">Изменения:</p>
        <p className="info__text">
          Пользовательские изменения:<br />
          - Добавлена функциональность загрузки и сохранения проектов JSON-файлами.<br />
          - Добавлены фактические рабочие точки на графики вентиляторов и их вывод в технике.<br />
          - Изменена логика расчёта отклонения в % по фактической рабочей точке.<br />
        </p>
        <p className="info__text">
          Исправления:<br />
          - Исправлено: отображение картинок вентиляторов при выборе настройки &laquo;Показывать результаты расчёта для всех вентиляторов:&raquo;.<br />
        </p>
        <p className="info__text">Версия программы 1.1.0</p>
        <p className="info__text">Изменения:</p>
        <p className="info__text">
          Пользовательские изменения:<br />
          - Добавлена функциональность выбора и выгрузки отдельных систем.<br />
          - Добавлена возможность удаления элементов из результатов расчёта.<br />
          - Добавлено изменение порядка систем посредством перетаскивания элементов.<br />
          - Изменён внешний вид тех. листа в соответствии с брендом Zilon OpenAir.<br />
          - При скачивании более одного тех. листа файлы добавляются в ZIP-архив.<br />
          - Для файлов тех. листов формируются уникальные имена<br />
        </p>
        <p className="info__text">
          Исправления:<br />
          - Исправлено: график не передаётся на сервер при выгрузке ТКП.<br />
          - Исправлено: убрана возможность одновременно сохранить несколько одинаковых систем.
        </p>
        <p className="info__text">---------------------</p>
        <p className="info__text">
          История подбора очищается при каждой перезагрузке страницы. Для загрузки и сохранения проектов необходимо пользоваться соответствующими файлами.<br />
          Раздел &laquo;Настройки&raquo; предоставляет дополнительные инструменты для работы с графиком.
          При длительной неактивности могут сброситься, т.к. хранятся браузере.
        </p>
        <p className="info__text">
          Название проекта фиксируется для всего расчёта до его очистки. Его можно изменить как в модальном окне, так и на странице результатов.<br />
          Лог расчёта по умолчанию присутствует, отображается только на странице расчёта. Контроллеры графика по
          умолчанию выключены.<br />
          Отклонение показывается в % по расходу воздуха от заданного в сравнении с фактической рабочей точкой. Если указано &laquo;- 100%&raquo;, значит
          вентилятор не может достичь заданного расхода воздуха.<br />
          В логах также показывается отклонение по напору вентилятора от фактической рабочей точки по заданному расходу воздуха.
        </p>
        <p className="info__text">FAQ:</p>
        <p className="info__text">
          Какие опции выбирать для крышного вентилятора?<br />
          Выбор опций зависит от требований проекта. По умолчанию рекомендуется выбор всех доступных аксессуаров:
          монтажный стакан (выбор одного вида), обратный клапан, фланец, гибкая вставка.
          Таким образом обеспечивается полный комплект для всех условий монтажа.
        </p>
        <p className="info__text">
          Зачем нужны конркетные опции:<br />
          - Монтажный стакан предназначен для установки крышного вентилятора на кровлю через узел прохода.<br />
          - Обратный клапан предотвращает своботный ход воздуха при выключенном вентиляторе.<br />
          - Фланец является ответной частью для присоединения к воздуховоду, устанавливается на гибкую вставку.<br />
          - Гибкая вставка является виброгасителем, предотвращает передачу вибраций на воздуховод.
        </p>
      </div>
    </section>
  );
}

export default Info;
